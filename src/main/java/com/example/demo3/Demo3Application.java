package com.example.demo3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.thymeleaf.dialect.IDialect;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.spring5.dialect.SpringStandardDialect;
import org.thymeleaf.templateresolver.StringTemplateResolver;

@SpringBootApplication
public class Demo3Application {

	public static void main(String[] args) {
		SpringApplication.run(Demo3Application.class, args);
	}

	@Bean("StringTemplateEngine")
	public SpringTemplateEngine StringTemplateResolver() {
		//创建TemplateEngine
		SpringTemplateEngine springTemplateEngine = new SpringTemplateEngine();
		IDialect dialect = new SpringStandardDialect();
		springTemplateEngine.setDialect(dialect);
		//创建StringTemplateResolver
		StringTemplateResolver resolver = new StringTemplateResolver();
		resolver.setCacheable(true);
		//引擎使用StringTemplateResolver
		springTemplateEngine.setTemplateResolver(resolver);
		return springTemplateEngine;
	}
}
