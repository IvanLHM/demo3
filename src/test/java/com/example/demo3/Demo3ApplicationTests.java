package com.example.demo3;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashMap;
import java.util.Map;

@SpringBootTest
class Demo3ApplicationTests {

	@Autowired
	private EmailHandler emailHandler;

	@Test
	void contextLoads() {
		System.out.println("ni hao ");
	}


	@Test
	public void test() {
		Map<String, Object> source = new HashMap<>();
		Map<String, Object> map = new HashMap<>();
		source.put("name", "你好");
		source.put("sex", "女");

		String target = "姓名：[(${name})]<br/>性别：[(${sex})]";

		//String target2 = "<div th:if=\"(${name})\"></div>";
		String target2= "<div th:remove=\"tag\" th:if=\"${name eq '你好'}\">222222</div>";
		String target3="<th:if=\"${name eq '你好'}\">";
		//String target2= "<th:block th:if=\"${name eq '你2好'}\" />222222";
		String aa=emailHandler.resorverTemplate(target, source);
		String bb=emailHandler.resorverTemplate(target2, source);
		String cc=emailHandler.resorverTemplate(target3, source);
		System.out.println("aa:::::::::"+aa);
		System.out.println("bb:::::::::"+bb);
		System.out.println("bb:::::::::"+cc);
//		String s = mapper.selectEmailTemplateById(EmailEnum.CONTRACT_LEGAL_APPROVE.getTemplateId());
//		System.out.println("s:::::::::::::"+s);
//		String content = emailHandler.resorverTemplate(s, source);
//		System.out.println("content:::::::::"+content);

	}
}
